import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import VideoPlayer from '../../components/videoPlayer/VideoPlayer';
import { io } from 'socket.io-client';
import styles from './contents.module.css'; /// 경로 추가.
import { Quiz } from './types';

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
  const [quiz, sendQuiz] = useState<Quiz | null>(null);

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
  }, [id]); // id가 변경될 때마다 이 효과를 재실행

  useEffect(() => {
    if (!id) return; // id가 없으면 아무 것도 하지 않음

    const socket = io('wss://eduplay.jisuheo.shop', {
      transports: ['websocket'],
    });
    console.log('socket.io connected');

    // 퀴즈 주제 선택
    socket.emit('startQuiz', id); // topic 선택은 router의 query로부터 가져옴

    // 퀴즈 받아오기
    socket.on('sendQuiz', (quiz: Quiz) => {
      console.log('fr: ', quiz);

      // 퀴즈와 정답지 표시
      console.log(quiz.quiz);
      quiz.answerList.forEach((option, idx) => {
        console.log({ index: idx + 1, option: option });
      });
      // 사용자에게 답변 선택 요청
      const userAnswer = prompt('정답을 골라주세요: '); // 입력 말고 클릭이벤트로 변경
      let isCorrect = false;

      // 선택한 답변 서버로 전송 (정답여부 포함)
      if (quiz.answerList[userAnswer - 1] == quiz.answer) {
        isCorrect = true;
        console.log('맞았습니다!!');
      } else {
        console.log('틀렸습니다 ㅜㅜ');
      }

      socket.emit('sendAnswer', {
        quizId: quiz.id,
        isCorrect: isCorrect,
      });
    });

    socket.on('user disconnection', (msg: string) => {
      console.log('연결 종료', msg);
    });
  });

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
      {quiz && (
        <div>
          <p>{quiz.quiz}</p>
          {quiz.answerList.map((option, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx + 1)}>
              {idx + 1}: {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
