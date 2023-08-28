export { type OrbitElements, updateOrbit };

interface OrbitElements {
	time: number,
	orbiter: THREE.Mesh
}

const updateOrbit = (props: OrbitElements) => {
	const { time, orbiter } = props;

	const semiMajorAxis = 3;
	const eccentricity = 0.2;
	const inclination = Math.PI / 4;
	const ascendingNode = 0;
	const argumentOfPeriapsis = Math.PI / 2;
	const orbitalPeriod = 20;
	const angle = (time / 1000) * (2 * Math.PI) / orbitalPeriod;

	const eccentricAnomaly = calculateEccentricAnomaly(angle, eccentricity);
	const xOrbital = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
	const yOrbital = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);

	const x = xOrbital * (Math.cos(ascendingNode) * Math.cos(argumentOfPeriapsis) - Math.sin(ascendingNode) * Math.sin(argumentOfPeriapsis) * Math.cos(inclination)) - yOrbital * (Math.sin(ascendingNode) * Math.cos(argumentOfPeriapsis) + Math.cos(ascendingNode) * Math.sin(argumentOfPeriapsis) * Math.cos(inclination));
	const y = xOrbital * (Math.cos(ascendingNode) * Math.sin(argumentOfPeriapsis) + Math.sin(ascendingNode) * Math.cos(argumentOfPeriapsis) * Math.cos(inclination)) + yOrbital * (Math.cos(ascendingNode) * Math.cos(argumentOfPeriapsis) * Math.cos(inclination) - Math.sin(ascendingNode) * Math.sin(argumentOfPeriapsis));
	const z = xOrbital * (Math.sin(ascendingNode) * Math.sin(inclination)) + yOrbital * (Math.cos(ascendingNode) * Math.sin(inclination));

	orbiter.position.set(x, y, z);

	orbiter.rotation.x += 0.01;
	orbiter.rotation.y += 0.01;
};

const calculateEccentricAnomaly = (meanAnomaly: number, eccentricity: number) => {
	const maxIterations = 1000;
	let eccentricAnomaly = meanAnomaly;
	for (let i = 0; i < maxIterations; i++) {
		const nextEccentricAnomaly = eccentricAnomaly - (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) / (1 - eccentricity * Math.cos(eccentricAnomaly));
		if (Math.abs(nextEccentricAnomaly - eccentricAnomaly) < 1e-6) {
			eccentricAnomaly = nextEccentricAnomaly;
			break;
		}
		eccentricAnomaly = nextEccentricAnomaly;
	}
	return eccentricAnomaly;
};