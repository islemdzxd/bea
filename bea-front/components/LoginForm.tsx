"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

type AuthResponse = {
  token: string;
  nom: string;
  prenom: string;
  cli: string;
};

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#email-clip)">
        <path d="M14.2043 2.99039H3.73797C3.14314 2.99039 2.57268 3.22668 2.15208 3.64728C1.73147 4.06789 1.49518 4.63835 1.49518 5.23318V12.7091C1.49518 13.304 1.73147 13.8744 2.15208 14.295C2.57268 14.7156 3.14314 14.9519 3.73797 14.9519H14.2043C14.7991 14.9519 15.3696 14.7156 15.7902 14.295C16.2108 13.8744 16.4471 13.304 16.4471 12.7091V5.23318C16.4471 4.63835 16.2108 4.06789 15.7902 3.64728C15.3696 3.22668 14.7991 2.99039 14.2043 2.99039V2.99039ZM13.7034 4.48558L8.97114 8.03666L4.23886 4.48558H13.7034ZM14.2043 13.4567H3.73797C3.53969 13.4567 3.34954 13.378 3.20934 13.2378C3.06914 13.0976 2.99037 12.9074 2.99037 12.7091V5.42007L8.52258 9.56923C8.65199 9.66629 8.80938 9.71875 8.97114 9.71875C9.1329 9.71875 9.29029 9.66629 9.4197 9.56923L14.9519 5.42007V12.7091C14.9519 12.9074 14.8731 13.0976 14.7329 13.2378C14.5927 13.378 14.4026 13.4567 14.2043 13.4567Z" fill="#F3FAFF" />
      </g>
      <defs>
        <clipPath id="email-clip">
          <rect width="17.9423" height="17.9423" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#lock-clip)">
        <path d="M12.7091 5.98076H11.9615V4.56781C11.9615 3.77471 11.6465 3.01409 11.0856 2.45329C10.5248 1.89248 9.76422 1.57742 8.97113 1.57742C8.17803 1.57742 7.41741 1.89248 6.8566 2.45329C6.2958 3.01409 5.98074 3.77471 5.98074 4.56781V5.98076H5.23314C4.63832 5.98076 4.06786 6.21706 3.64725 6.63766C3.22665 7.05827 2.99036 7.62873 2.99036 8.22355V14.2043C2.99036 14.7991 3.22665 15.3696 3.64725 15.7902C4.06786 16.2108 4.63832 16.4471 5.23314 16.4471H12.7091C13.3039 16.4471 13.8744 16.2108 14.295 15.7902C14.7156 15.3696 14.9519 14.7991 14.9519 14.2043V8.22355C14.9519 7.62873 14.7156 7.05827 14.295 6.63766C13.8744 6.21706 13.3039 5.98076 12.7091 5.98076ZM7.47593 4.56781C7.46588 4.16059 7.61756 3.76597 7.89779 3.47033C8.17801 3.1747 8.56395 3.00212 8.97113 2.99038C9.3783 3.00212 9.76424 3.1747 10.0445 3.47033C10.3247 3.76597 10.4764 4.16059 10.4663 4.56781V5.98076H7.47593V4.56781ZM13.4567 14.2043C13.4567 14.4026 13.3779 14.5927 13.2377 14.733C13.0975 14.8732 12.9074 14.9519 12.7091 14.9519H5.23314C5.03487 14.9519 4.84472 14.8732 4.70451 14.733C4.56431 14.5927 4.48555 14.4026 4.48555 14.2043V8.22355C4.48555 8.02528 4.56431 7.83512 4.70451 7.69492C4.84472 7.55472 5.03487 7.47596 5.23314 7.47596H12.7091C12.9074 7.47596 13.0975 7.55472 13.2377 7.69492C13.3779 7.83512 13.4567 8.02528 13.4567 8.22355V14.2043Z" fill="#C3C3C3" />
        <path d="M8.97118 8.97116C8.5276 8.97116 8.09398 9.1027 7.72516 9.34914C7.35633 9.59558 7.06887 9.94586 6.89912 10.3557C6.72937 10.7655 6.68495 11.2164 6.77149 11.6515C6.85803 12.0866 7.07163 12.4862 7.38529 12.7998C7.69895 13.1135 8.09858 13.3271 8.53364 13.4136C8.9687 13.5002 9.41964 13.4558 9.82946 13.286C10.2393 13.1163 10.5896 12.8288 10.836 12.46C11.0824 12.0912 11.214 11.6575 11.214 11.2139C11.214 10.6191 10.9777 10.0487 10.5571 9.62806C10.1365 9.20745 9.56601 8.97116 8.97118 8.97116ZM8.97118 11.9615C8.82332 11.9615 8.67878 11.9177 8.55584 11.8356C8.4329 11.7534 8.33708 11.6366 8.28049 11.5C8.22391 11.3634 8.20911 11.2131 8.23795 11.0681C8.2668 10.9231 8.338 10.7899 8.44255 10.6853C8.54711 10.5808 8.68031 10.5096 8.82533 10.4807C8.97035 10.4519 9.12067 10.4667 9.25728 10.5233C9.39388 10.5798 9.51064 10.6757 9.59279 10.7986C9.67493 10.9215 9.71878 11.0661 9.71878 11.2139C9.71878 11.4122 9.64001 11.6024 9.49981 11.7426C9.35961 11.8828 9.16946 11.9615 8.97118 11.9615Z" fill="#C3C3C3" />
      </g>
      <defs>
        <clipPath id="lock-clip">
          <rect width="17.9423" height="17.9423" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#eye-off-clip)">
        <path d="M3.52119 2.45958C3.45149 2.38987 3.36874 2.33458 3.27766 2.29686C3.18659 2.25913 3.08898 2.23972 2.9904 2.23972C2.89182 2.23972 2.79421 2.25913 2.70314 2.29686C2.61206 2.33458 2.52931 2.38987 2.45961 2.45958C2.31883 2.60035 2.23975 2.79128 2.23975 2.99037C2.23975 3.18946 2.31883 3.38039 2.45961 3.52116L6.66857 7.73013C6.40228 8.2255 6.30269 8.79349 6.38455 9.34991C6.46642 9.90633 6.72538 10.4216 7.12307 10.8192C7.52075 11.2169 8.03598 11.4759 8.5924 11.5578C9.14882 11.6396 9.71681 11.54 10.2122 11.2737L14.4211 15.4827C14.4906 15.5528 14.5733 15.6084 14.6644 15.6463C14.7555 15.6843 14.8532 15.7038 14.9519 15.7038C15.0506 15.7038 15.1483 15.6843 15.2394 15.6463C15.3305 15.6084 15.4132 15.5528 15.4827 15.4827C15.5528 15.4132 15.6084 15.3305 15.6464 15.2394C15.6843 15.1483 15.7039 15.0506 15.7039 14.9519C15.7039 14.8532 15.6843 14.7555 15.6464 14.6644C15.6084 14.5733 15.5528 14.4906 15.4827 14.4211L3.52119 2.45958ZM8.97117 10.0925C8.67376 10.0925 8.38853 9.97439 8.17822 9.76409C7.96792 9.55378 7.84978 9.26855 7.84978 8.97114V8.91881L9.01603 10.0851L8.97117 10.0925Z" fill="#C3C3C3" />
        <path d="M9.13559 12.7091C5.92093 12.7839 3.81271 10.0253 3.15482 8.97115C3.62317 8.22407 4.18603 7.5406 4.82944 6.93769L3.73795 5.88358C2.89415 6.67862 2.17129 7.59291 1.59235 8.59735C1.52673 8.711 1.49219 8.83992 1.49219 8.97115C1.49219 9.10238 1.52673 9.2313 1.59235 9.34495C2.06333 10.1598 4.58273 14.2043 8.98607 14.2043H9.17297C10.001 14.1798 10.8183 14.0102 11.5877 13.7034L10.4065 12.5222C9.99112 12.6315 9.56485 12.6942 9.13559 12.7091Z" fill="#C3C3C3" />
        <path d="M16.35 8.59737C15.8715 7.76753 13.2325 3.60342 8.76935 3.73799C7.94135 3.76255 7.12407 3.93208 6.35461 4.23888L7.53582 5.42008C7.9512 5.31081 8.37747 5.24812 8.80673 5.23318C12.0139 5.15095 14.1221 7.91705 14.7875 8.97116C14.3076 9.72048 13.7321 10.4041 13.0755 11.0046L14.2044 12.0587C15.0588 11.2658 15.7918 10.3514 16.3799 9.34496C16.441 9.22871 16.4704 9.0984 16.4652 8.96715C16.4599 8.83591 16.4202 8.70837 16.35 8.59737V8.59737Z" fill="#C3C3C3" />
      </g>
      <defs>
        <clipPath id="eye-off-clip">
          <rect width="17.9423" height="17.9423" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#eye-clip)">
        <path d="M8.97114 4.48558C5.23318 4.48558 2.24038 7.95595 1.49518 8.97116C2.24038 9.98637 5.23318 13.4567 8.97114 13.4567C12.7091 13.4567 15.7019 9.98637 16.4471 8.97116C15.7019 7.95595 12.7091 4.48558 8.97114 4.48558ZM8.97114 11.9615C8.37631 11.9615 7.79491 11.7854 7.30071 11.4554C6.80651 11.1255 6.42137 10.6569 6.19424 10.1091C5.96712 9.56131 5.90799 8.95857 6.02388 8.37699C6.13977 7.79542 6.42549 7.26089 6.84609 6.84029C7.26669 6.41969 7.80122 6.13397 8.3828 6.01808C8.96437 5.90219 9.56711 5.96131 10.1149 6.18844C10.6627 6.41557 11.1313 6.80071 11.4613 7.29491C11.7912 7.78911 11.9673 8.37051 11.9673 8.96534C11.9673 9.76395 11.6514 10.5299 11.0962 11.0904C10.541 11.6509 9.77989 11.9615 8.97114 11.9615ZM8.97114 7.47596C8.5746 7.47596 8.18672 7.59333 7.85772 7.8134C7.52872 8.03347 7.27319 8.3465 7.12337 8.71333C6.97355 9.08016 6.9362 9.48293 7.0161 9.87146C7.096 10.26 7.28954 10.6165 7.57249 10.8994C7.85544 11.1824 8.21197 11.3759 8.6005 11.4558C8.98903 11.5357 9.3918 11.4984 9.75863 11.3486C10.1255 11.1987 10.4385 10.9432 10.6586 10.6142C10.8786 10.2852 10.996 9.89732 10.996 9.50078C10.996 8.96964 10.7854 8.46014 10.4097 8.08446C10.0341 7.70877 9.52458 7.49812 8.99344 7.49812L8.97114 7.47596Z" fill="#C3C3C3" />
      </g>
      <defs>
        <clipPath id="eye-clip">
          <rect width="17.9423" height="17.9423" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CheckmarkSquare() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#check-clip)">
        <path d="M15.1388 2.52313H5.04627C4.37709 2.52313 3.73532 2.78896 3.26214 3.26214C2.78896 3.73532 2.52313 4.37709 2.52313 5.04627V15.1388C2.52313 15.808 2.78896 16.4498 3.26214 16.9229C3.73532 17.3961 4.37709 17.662 5.04627 17.662H15.1388C15.808 17.662 16.4498 17.3961 16.9229 16.9229C17.3961 16.4498 17.662 15.808 17.662 15.1388V5.04627C17.662 4.37709 17.3961 3.73532 16.9229 3.26214C16.4498 2.78896 15.808 2.52313 15.1388 2.52313ZM13.709 8.08244L9.86546 13.1287C9.78711 13.2305 9.68649 13.313 9.57132 13.3698C9.45614 13.4267 9.32948 13.4564 9.20103 13.4567C9.07329 13.4574 8.94706 13.429 8.83193 13.3736C8.71681 13.3182 8.61581 13.2374 8.53661 13.1371L6.48446 10.5215C6.41653 10.4342 6.36646 10.3344 6.33709 10.2278C6.30773 10.1212 6.29965 10.0099 6.31332 9.90016C6.32698 9.79043 6.36213 9.68447 6.41675 9.58832C6.47137 9.49218 6.54439 9.40773 6.63164 9.33981C6.80786 9.20263 7.03135 9.14106 7.25296 9.16867C7.36269 9.18233 7.46865 9.21748 7.56479 9.2721C7.66094 9.32672 7.74538 9.39974 7.81331 9.48699L9.18421 11.2364L12.3634 7.03114C12.4307 6.94278 12.5149 6.86856 12.6109 6.81271C12.707 6.75686 12.8131 6.72047 12.9232 6.70563C13.0333 6.6908 13.1453 6.69779 13.2527 6.72622C13.3601 6.75466 13.4609 6.80397 13.5492 6.87134C13.6376 6.93871 13.7118 7.02283 13.7677 7.11889C13.8235 7.21494 13.8599 7.32106 13.8747 7.43118C13.8896 7.5413 13.8826 7.65326 13.8542 7.76068C13.8257 7.86809 13.7764 7.96885 13.709 8.05721V8.08244Z" fill="#F3FAFF" />
      </g>
      <defs>
        <clipPath id="check-clip">
          <rect width="20.1851" height="20.1851" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath="url(#google-clip)">
        <path d="M16.0644 8.37744C16.0644 7.70361 16.0097 7.21189 15.8914 6.70197H8.19653V9.7433H12.7133C12.6222 10.4991 12.1305 11.6374 11.0377 12.4022L11.0224 12.504L13.4554 14.3887L13.6239 14.4056C15.172 12.9759 16.0644 10.8724 16.0644 8.37744Z" fill="#4285F4" />
        <path d="M8.19653 16.3906C10.4093 16.3906 12.267 15.6621 13.6239 14.4055L11.0377 12.4022C10.3456 12.8848 9.41676 13.2217 8.19653 13.2217C6.02923 13.2217 4.18976 11.7921 3.53404 9.81616L3.43793 9.82432L0.908084 11.7821L0.875 11.8741C2.22273 14.5512 4.99107 16.3906 8.19653 16.3906Z" fill="#34A853" />
        <path d="M3.53409 9.81616C3.36107 9.30624 3.26094 8.75984 3.26094 8.1953C3.26094 7.6307 3.36107 7.08437 3.52498 6.57445L3.5204 6.46585L0.958853 4.47662L0.875044 4.51649C0.31958 5.62742 0.000854492 6.87495 0.000854492 8.1953C0.000854492 9.51566 0.31958 10.7631 0.875044 11.8741L3.53409 9.81616Z" fill="#FBBC05" />
        <path d="M8.19653 3.16883C9.73548 3.16883 10.7736 3.83356 11.3655 4.38906L13.6785 2.13078C12.258 0.810428 10.4093 0 8.19653 0C4.99107 0 2.22273 1.83938 0.875 4.51649L3.52494 6.57445C4.18976 4.59848 6.02923 3.16883 8.19653 3.16883Z" fill="#EB4335" />
      </g>
      <defs>
        <clipPath id="google-clip">
          <rect width="16.0729" height="16.4471" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#close-clip)">
        <path d="M22.5568 20.1851L29.7898 12.9689C30.1065 12.6522 30.2845 12.2226 30.2845 11.7746C30.2845 11.3267 30.1065 10.8971 29.7898 10.5804C29.4731 10.2636 29.0435 10.0857 28.5955 10.0857C28.1476 10.0857 27.718 10.2636 27.4012 10.5804L20.1851 17.8133L12.9689 10.5804C12.6521 10.2636 12.2226 10.0857 11.7746 10.0857C11.3267 10.0857 10.8971 10.2636 10.5803 10.5804C10.2636 10.8971 10.0856 11.3267 10.0856 11.7746C10.0856 12.2226 10.2636 12.6522 10.5803 12.9689L17.8133 20.1851L10.5803 27.4013C10.4227 27.5576 10.2975 27.7437 10.2121 27.9487C10.1267 28.1536 10.0828 28.3735 10.0828 28.5955C10.0828 28.8176 10.1267 29.0375 10.2121 29.2424C10.2975 29.4474 10.4227 29.6335 10.5803 29.7898C10.7367 29.9475 10.9227 30.0726 11.1277 30.158C11.3327 30.2434 11.5526 30.2874 11.7746 30.2874C11.9967 30.2874 12.2165 30.2434 12.4215 30.158C12.6265 30.0726 12.8125 29.9475 12.9689 29.7898L20.1851 22.5568L27.4012 29.7898C27.5576 29.9475 27.7436 30.0726 27.9486 30.158C28.1536 30.2434 28.3735 30.2874 28.5955 30.2874C28.8176 30.2874 29.0374 30.2434 29.2424 30.158C29.4474 30.0726 29.6334 29.9475 29.7898 29.7898C29.9475 29.6335 30.0726 29.4474 30.158 29.2424C30.2434 29.0375 30.2874 28.8176 30.2874 28.5955C30.2874 28.3735 30.2434 28.1536 30.158 27.9487C30.0726 27.7437 29.9475 27.5576 29.7898 27.4013L22.5568 20.1851Z" fill="#C3C3C3" />
      </g>
      <defs>
        <clipPath id="close-clip">
          <rect width="40.3702" height="40.3702" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [cli, setCli] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedCli = cli.trim();
    if (!normalizedCli || !password) {
      setErrorMessage("Please enter your CLI and MDP.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL ?? "http://localhost:8080";
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cli: normalizedCli,
          password,
        }),
      });

      if (!response.ok) {
        let message = "CLI or MDP is incorrect.";
        try {
          const text = await response.text();
          if (text.trim()) {
            message = text;
          }
        } catch {
          // Keep fallback message if response body cannot be read.
        }
        throw new Error(message);
      }

      const data = (await response.json()) as AuthResponse;
      if (!data.token) {
        throw new Error("Authentication token was not returned by the server.");
      }

      const selectedStorage = rememberMe ? globalThis.localStorage : globalThis.sessionStorage;
      const otherStorage = rememberMe ? globalThis.sessionStorage : globalThis.localStorage;

      otherStorage.removeItem("bea_client_token");
      otherStorage.removeItem("bea_client_profile");
      selectedStorage.setItem("bea_client_token", data.token);
      selectedStorage.setItem(
        "bea_client_profile",
        JSON.stringify({
          cli: data.cli,
          nom: data.nom,
          prenom: data.prenom,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#113B89]">
      <div className="absolute inset-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/ae42ace981fb74eec11b3464be8796e5e680ed1b?width=2088"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <button className="absolute right-4 top-4 z-20 cursor-pointer transition-opacity hover:opacity-70 sm:right-6 sm:top-6" type="button">
        <CloseIcon />
      </button>

      <div className="relative z-10 w-full max-w-[390px] px-5 py-5 sm:max-w-[410px] sm:px-6 sm:py-6 lg:py-0">
        <div className="mb-5 sm:mb-6">
          <h1 className="mb-1 text-2xl font-bold leading-tight text-[#FFFCFC] sm:mb-2 sm:text-3xl">Welcome Back</h1>
          <p className="text-[#FFFAFA] text-base font-normal">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-cli" className="text-[#FFFCFC] text-sm font-normal">
                CLI
              </label>
              <div className="flex h-11 items-center gap-3 border border-[#F3FAFF] px-4 sm:h-[50px] sm:px-4">
                <EmailIcon />
                <input
                  id="login-cli"
                  type="text"
                  value={cli}
                  onChange={(e) => setCli(e.target.value)}
                  className="flex-1 bg-transparent text-[#FFFCFC] text-base font-normal outline-none placeholder-[#C3C3C3]"
                  placeholder="Enter your CLI"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[#FFFCFC] text-sm font-normal">
                MDP
              </label>
              <div className="flex h-11 items-center gap-3 border border-[#F0F0F0] px-4 sm:h-[50px] sm:px-4">
                <LockIcon />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-[#FFFCFC] text-base font-normal outline-none placeholder-[#C3C3C3]"
                  placeholder="Enter your MDP"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe ? <CheckmarkSquare /> : <div className="w-5 h-5 border border-[#F3FAFF]" />}
                <span className="text-sm font-normal text-[#F3FAFF] sm:text-base">Remember me</span>
              </button>
              <button
                type="button"
                className="text-sm font-medium text-[#C3C3C3] transition-colors hover:text-[#F3FAFF] sm:text-base"
              >
                Forgot Password
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p className="text-sm text-[#FFD4D4]" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#F3FAFF] text-base font-medium text-[#113B89] transition-colors hover:bg-white sm:h-[50px]"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#F0F0F0]" />
              <span className="text-[#FFFAFA] text-base">or</span>
              <div className="flex-1 h-px bg-[#F0F0F0]" />
            </div>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 border border-[#F3FAFF] text-base font-medium text-[#F3FAFF] transition-colors hover:bg-white/10 sm:h-[50px]"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 pt-1 sm:pt-2">
            <span className="text-sm font-normal text-[#FFFAFA] sm:text-base">Don't have an account?</span>
            <button
              type="button"
              className="text-sm font-semibold text-[#F3FAFF] underline underline-offset-2 transition-opacity hover:opacity-80 sm:text-base"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
