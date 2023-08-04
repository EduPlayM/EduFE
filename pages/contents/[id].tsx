import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import VideoPlayer from '../../components/videoPlayer/VideoPlayer';
import { io } from 'socket.io-client';
import styles from './contents.module.css'; /// 경로 추가.
import { Quiz } from '../../types/contents';

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
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

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

  const handleStartQuiz = () => {
    const socket = io('wss://eduplay.jisuheo.shop', {
      transports: ['websocket'],
    });
    console.log('socket.io connected');

    setSocket(socket);

    socket.emit('startQuiz', 1); // topic 선택은 나중에 prompt로 수정

    socket.on('sendQuiz', (quiz: Quiz) => {
      console.log('fr: ', quiz);

      setQuiz(quiz);
    });

    socket.on('user disconnection', (msg: string) => {
      console.log('연결 종료', msg);
    });
  };

  const handleAnswer = (userAnswer: number) => {
    if (
      quiz &&
      quiz.answerList &&
      quiz.answerList[userAnswer - 1] == quiz.answer
    ) {
      setIsCorrect(true);
      alert('정답입니다 👍');
      // handleStartQuiz();
    } else {
      alert('오답입니다 ❌');
    }

    if (socket && quiz) {
      socket.emit('sendAnswer', {
        quizId: quiz.id,
        isCorrect: isCorrect,
      });
    }
  };

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
        <div className="flex justify-center my-[2rem]">
          <button className="btn btn-wide" onClick={handleStartQuiz}>
            퀴즈 시작
          </button>
        </div>
      </div>
      {quiz && quiz.answerList && (
        <div>
          <p className="flex mb-4 text-2xl">{quiz.quiz}</p>
          {quiz.answerList.map((option, idx) => (
            <button
              className="btn mr-4"
              key={idx}
              onClick={() => handleAnswer(idx + 1)}
            >
              {idx + 1}: {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
