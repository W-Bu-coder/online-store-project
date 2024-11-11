import './App.css';

const api = "http://localhost:3036"

const handleClick = () => {
  let url = api + '/hello';
  console.log('Sending request to:', url); // 打印请求 URL

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      console.log('Response status:', res.status); // 打印响应状态
      return res.json();
    })
    .then(data => console.log('Response data:', data))
    .catch(error => {
      console.error('Fetch error:', error); // 详细错误信息
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    });
};

function App() {
  return (
    <div className="App">
      <button onClick={()=>handleClick()}>Click to send request</button>
    </div>
  );
}

export default App;
