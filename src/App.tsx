import './styles/globals.css';
import { Uploader } from './components/uploader';

function App() {
  return (
    <>
      <main className='container'>
        <Uploader />

        <footer>
          <span>
            created by{' '}
            <a
              href='https://github.com/miguelsndc'
              target='_blank'
              rel='noreferrer'
            >
              miguelsndc
            </a>
            - devChallenges.io
          </span>
        </footer>
      </main>
    </>
  );
}

export default App;
