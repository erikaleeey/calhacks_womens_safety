import * as Location from 'expo-location';

const getLocationAndSend = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Send coordinates to your Flask API
  const response = await fetch("http://127.0.0.1:5000/predict-risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude })
  });

  const result = await response.json();
  console.log("Predicted Risk:", result);
};
