import { Spinner } from "react-activity";

const Loading = ({ loading }: { loading: boolean }) => {
  return (
    <div
      data-testid="loading-component"
      className="fixed inset-0 z-50 flex items-center justify-center bg-hoverbutton">
      <Spinner
        size={50}
        color="#000000"
        animating={loading}
      />
    </div>  
  );
};

export default Loading;
