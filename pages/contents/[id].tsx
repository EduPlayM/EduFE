import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import VideoPlayer from '../../components/videoPlayer/VideoPlayer';

interface VideoDetails {
  id: string;
  originalName: string;
  url: string;
  topic_id: string;
}

const DetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const res = await axios.get(
          `https://eduplay.jisuheo.shop/contents/${id}`,
        );
        setVideoDetails(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchVideoDetails();
    }
  }, [id]);

  if (!videoDetails) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-[1200px] flex flex-col items-center mt-[3rem]">
      <div className="flex justify-center mb-[2rem] text-[1.6rem]">
        {videoDetails.originalName}
      </div>
      <div className="text-[1.2rem]">{videoDetails.originalName}</div>
      <div>
        <span className="badge mt-[2rem]"># {videoDetails.topic_id}</span>
        <span className="badge mt-[2rem]"># {videoDetails.url}</span>
      </div>
      <div className="mt-[2rem]">
        <div className="mb-[2rem]">
          <VideoPlayer videoSrc={videoDetails.url} />
        </div>
        <div>영상 설명</div>
      </div>
    </div>
  );
};

export default DetailsPage;
