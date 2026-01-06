import { EventButton } from '@components/common/button/EventButton';
import NotFoundIcon from '@components/common/icons/NotFoundIcon';
const NotFound = ({ msg }: { msg: string }) => {
  return (
    <div className="my-12 flex flex-col flex-wrap items-center justify-center gap-y-4">
      <div>
        <NotFoundIcon />
      </div>

      <h1 className="mt-4 font-outfit text-4xl font-semibold">
        Oops!, No products available in this category
      </h1>
      <p className="text-black/60 dark:text-white">{msg}</p>
      <EventButton buttonName="Back to Home" redirect="/" />
    </div>
  );
};

export default NotFound;
