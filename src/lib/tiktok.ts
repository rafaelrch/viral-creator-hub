export async function postToTikTok(videoBlob: Blob, caption: string, accessToken: string): Promise<void> {
  // 1. Initialize upload
  const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      post_info: {
        title: caption.slice(0, 150),
        privacy_level: "SELF_ONLY",
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoBlob.size,
        chunk_size: videoBlob.size,
        total_chunk_count: 1,
      },
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`TikTok init failed: ${err}`);
  }

  const initData = await initRes.json();
  const uploadUrl: string = initData.data.upload_url;
  const publishId: string = initData.data.publish_id;

  // 2. Upload video
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes 0-${videoBlob.size - 1}/${videoBlob.size}`,
      "Content-Length": String(videoBlob.size),
    },
    body: videoBlob,
  });

  if (!uploadRes.ok) {
    throw new Error(`TikTok upload failed: ${await uploadRes.text()}`);
  }

  // 3. Poll status
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch("https://open.tiktokapis.com/v2/post/publish/status/fetch/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ publish_id: publishId }),
    });
    const statusData = await statusRes.json();
    const status = statusData?.data?.status;
    if (status === "PUBLISH_COMPLETE") return;
    if (status === "FAILED") throw new Error("TikTok publishing failed");
  }
  throw new Error("TikTok publish timed out");
}
