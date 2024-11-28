import './App.css';

const api = 'http://10.147.19.129:3036'

const handleClick = async () => {
  let url = api + '/user/list';
  console.log('Sending request to:', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data));
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

function App() {
  return (
    <div className="App">
      <button onClick={()=>handleClick()}>Click to send request</button>
    </div>
  );
}

export default App;
