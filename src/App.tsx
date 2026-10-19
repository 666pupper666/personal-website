import { Route, Routes } from 'react-router-dom';
import { ScrollManager } from './components/ScrollManager';
import { StarryBackground } from './components/StarryBackground';
import { AdminPage } from './pages/AdminPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PostDetailPage } from './pages/PostDetailPage';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <StarryBackground />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
