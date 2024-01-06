import './App.css';
import ShowreelVideo from './assets/showreel.mp4';
import { CSSProperties, FunctionComponent } from 'react';

type ShowreelProps = { style: CSSProperties };

const Showreel: FunctionComponent<ShowreelProps> = ({ style }) => (<video src={ShowreelVideo} autoPlay loop muted style={style}></video>);

const App = () => (
	<>
		<div style={{ position: 'absolute', margin: '10px', width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
			<span style={{ color: 'white', fontSize: '33px' }}>Base Reality</span>
			<div style={{ minWidth: '50%', maxWidth: '90%' }}>
				<Showreel style={{ width: '100%', maxWidth: '400px', borderRadius: '9px' }} />
			</div>
		</div>
	</>
);

export default App;