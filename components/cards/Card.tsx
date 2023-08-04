import React from 'react';
import Button from '../ui/Button';
import VideoPlayer from '../videoPlayer/VideoPlayer';
import Link from 'next/link';

interface CardProps {
  cardName?: string;
  cardUrl?: number;
  cardSentence?: string;
  cardThumbnailUrl?: string;
  quiz?: string;
}

const Card = (props: CardProps) => {
  const { cardName, cardThumbnailUrl, quiz } = props;

  return (
    <div className="card bg-base-100 shadow-xl p-[1.5rem] m-[1rem] rounded-box">
      <div className="flex justify-center w-[14rem] mx-auto">
        <figure className="px-10 w-[12rem] h-[12rem]">
          <VideoPlayer videoSrc={cardThumbnailUrl} />
        </figure>
      </div>
      <div className="card-body items-center text-center pb-[1rem]">
        <div className="pb-[1rem]">
          <div>"예시 문장"</div>
          <div className="flex">
            <div>{quiz}</div>
          </div>
        </div>
        <div className="card-actions">
          <Link href={`/contents/${cardName}`}>
            <Button bgColor="bg-[#dddddd]">영상 재생</Button>
          </Link>
          <Button bgColor="bg-[#ff8a84]">퀴즈</Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
