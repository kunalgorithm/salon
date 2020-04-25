import * as SWRTC from "@andyet/simplewebrtc";
import { useRouter } from "next/router";
const API_KEY = "7634b68e89fdc867b9526edd";
import { Provider } from "react-redux";
export default (props) => {
  const router = useRouter();
  const ROOM_NAME = router.query.salon;
  // const ROOM_PASSWORD = "YOUR_ROOM_PASSWORD";
  const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

  const store = SWRTC.createStore();

  return (
    <Provider store={store}>
      <SWRTC.Provider configUrl={CONFIG_URL}>
        {/* Render based on the connection state */}
        <SWRTC.Connecting>
          <h1>Connecting...</h1>
        </SWRTC.Connecting>

        <SWRTC.Connected>
          <h1>Connected!</h1>
          {/* Request the user's media */}
          <SWRTC.RequestUserMedia audio auto />

          {/* Enable playing remote audio. */}
          <SWRTC.RemoteAudioPlayer />

          {/* Connect to a room with a name and optional password */}
          <SWRTC.Room name={ROOM_NAME as string}>
            {(props) => {
              /* Use the rest of the SWRTC React Components to render your UI */
              <div>{JSON.stringify(props)}</div>;
            }}
          </SWRTC.Room>
        </SWRTC.Connected>
      </SWRTC.Provider>
    </Provider>
  );
};
