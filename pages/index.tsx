import Card from '@/components/cards/Card';
import axios from 'axios';
import React from 'react';
import LazyLoad from 'react-lazy-load';

interface FileData {
  name: string;
  url: string;
  thumbnailUrl: string;
  length: number;
  quiz?: string;
}

interface CardData {
  topicId: number;
  name: number;
  url: string;
  length: number;
  thumbnailUrl: string;
  quiz?: string;
  files: FileData[];
}

interface HomeProps {
  cards: CardData[];
}

const Home: React.FC<HomeProps> = ({ cards }) => {
  if (!cards) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="categoryBar flex justify-evenly h-[5rem] items-center">
        {/* 카테고리 코드 */}
      </div>
      <div className="divider border-t-2"></div>
      <div className="contentsBar mt-[2rem]">
        {cards.map(topic => (
          <div key={topic.topicId}>
            <div className="text-[1.4rem]">{topic.name}</div> {/* 토픽 이름 */}
            <div className="cards grid grid-cols-3 rounded-box w-full">
              {topic.files.map(
                (
                  card, // 파일 순회
                ) => (
                  <div key={card.name}>
                    <LazyLoad height={440}>
                      <Card
                        cardName={card.name}
                        cardThumbnailUrl={card.thumbnailUrl}
                        quiz={card.quiz}
                      />
                    </LazyLoad>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await axios.get(
      'https://eduplay.jisuheo.shop/contents/level/1', // 여기를 파라미터로 바꾸려면 레벨을 받아와야 하는데 로그인구현이 안되어있어서 레벨을 못받아옴
    );
    const cards: CardData[] = res.data;

    return { props: { cards } };
  } catch (error) {
    console.log(error);
    return { props: { cards: [] } };
  }
};

export default Home;
