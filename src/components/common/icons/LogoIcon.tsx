export default function LogoIcon() {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="!min-h-10 !min-w-10 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-white dark:border-[#404040] dark:bg-black">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4.40234"
              y="8.07141"
              width="21.004"
              height="21.2374"
              className="fill-[#0041FF]"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.7392 3.94898C16.1961 2.40592 13.6943 2.40592 12.1513 3.94898C11.1758 4.92448 10.6277 6.24754 10.6277 7.6271V11.3387C10.6277 11.9187 10.1576 12.3889 9.57754 12.3889C8.99753 12.3889 8.52734 11.9187 8.52734 11.3387V7.6271C8.52734 5.69048 9.29666 3.83317 10.6661 2.46378C13.0294 0.100453 16.8611 0.100453 19.2244 2.46378C20.5938 3.83317 21.3631 5.69047 21.3631 7.62709V11.3387C21.3631 11.9187 20.8929 12.3889 20.3129 12.3889C19.7329 12.3889 19.2627 11.9187 19.2627 11.3387V7.62709C19.2627 6.24754 18.7147 4.92448 17.7392 3.94898Z"
              className="fill-black dark:fill-white"
            />
            <rect
              x="4.40234"
              y="25.8081"
              width="21.004"
              height="3.50067"
              className="fill-black dark:fill-white"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-black dark:text-white">
          Bagisto Store
        </p>
      </div>
    </>
  );
}
