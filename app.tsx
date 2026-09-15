import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [spanColor, setspanColor] = useState('#fff');
  const [Exam, setExam] = useState('hamburger');

  // const colorChange = () => {
  //   if(Exam == 'sunny'){
  //     setspanColor('#123123');
  //   };
  // };
  useEffect(() => {
    if(Exam == '1'){
      setspanColor('#332211');
    }
    else if(Exam == '2'){
      setspanColor('#998833');
    }
    else {
      setspanColor('#fff')
    }
  });

  return (
    <>
    <div className="out_header">
      <header>
        <section className="logo">
          <a href="#" target='_top'><span style={{color: spanColor}}>SPAN</span>Weather</a>
        </section>
      </header>
    </div>
    <div className="out_main">
    <section className='main'>
      <input type="text" value={Exam} onChange={(exam) => setExam(exam.target.value)}/>
      {/* <button onClick={colorChange}>tlqkf</button> */}
    </section>
    </div>
    </>
  )
}

export default App
