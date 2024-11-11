import './App.css';

const api = "http://localhost:3036"

const handleClick = () => {
  let url = api + '/hello';
  console.log('Sending request to:', url);

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => res.json())
    .then(data => console.log('Response data:', data))
    .catch(error => {
      console.error('Fetch error:', error);
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
