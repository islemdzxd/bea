import LoginLeftPanel from "../components/LoginLeftPanel";
import LoginForm from "../components/LoginForm";

export default function HomePage() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <div className="hidden lg:flex lg:w-[49%] xl:w-[48%]">
        <LoginLeftPanel />
      </div>

      <div className="flex min-h-0 flex-1">
        <LoginForm />
      </div>
    </div>
  );
}
