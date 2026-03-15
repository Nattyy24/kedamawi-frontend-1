import Auth from "./components/Auth";
import PostJob from "./components/PostJob";
export default function App() {
  return (
    <div style={{padding:"40px",fontFamily:"Arial"}}>
      <h1>Kedamawi Marketplace</h1>
      <p>Hire & work smarter in Ethiopia</p>

      <Auth />
    </div>
  );
}
