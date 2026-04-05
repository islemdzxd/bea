export default function LoginLeftPanel() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-start overflow-hidden bg-[#EDF3FF]">
      <div className="relative z-10 flex w-full items-center justify-center gap-0 pt-8 xl:pt-10">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f2019e5f8776a037092309d2a77597b4db0baf8f?width=246"
          alt="BEA Logo"
          className="h-auto w-[78px] object-contain"
        />
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/20705f2b54e917890f9b7bb396105afbbf72c755?width=658"
          alt="Banque Exterieure d'Algerie"
          className="h-auto w-[176px] object-contain lg:w-[210px]"
        />
      </div>

      <div className="relative flex w-full flex-1 items-end justify-center pb-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/21298b1a31e4d24e16a811e08fe1e5ca59fba6f4?width=1360"
          alt="BEA Prepaid Mastercard"
          className="h-auto w-full max-w-[500px] -translate-y-6 object-contain object-bottom lg:w-[82%] lg:max-w-none lg:-translate-y-8"
        />
      </div>
    </div>
  );
}
