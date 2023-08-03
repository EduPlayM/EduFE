import Card from '@/components/cards/Card';
import axios from 'axios';
import React from 'react';
import LazyLoad from 'react-lazy-load';

interface CardData {
  name: number;
  url: string;
  length: number;
  thumbnailUrl: string;
  quiz?: string;
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
        <div>카테고리1</div>
        <div>카테고리2</div>
        <div>카테고리3</div>
        <div>카테고리4</div>
        <div>카테고리5</div>
        <div>카테고리6</div>
        <div>카테고리7</div>
      </div>
      <div className="divider border-t-2"></div>
      <div className="contentsBar mt-[2rem]">
        <div className="text-[1.4rem]">어떻게 지내?</div>
        <div className="cards grid grid-cols-3 rounded-box w-full">
          {cards.map(card => (
            <div key={card.name}>
              <LazyLoad height={440}>
                <Card
                  cardName={card.name}
                  cardThumbnailUrl={card.thumbnailUrl}
                  quiz={card.quiz}
                />
              </LazyLoad>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await axios.get('https://eduplay.jisuheo.shop/contents');
    const cards: CardData[] = res.data;

    return { props: { cards } };
  } catch (error) {
    console.log(error);
    return { props: { cards: [] } };
  }
};

export default Home;
