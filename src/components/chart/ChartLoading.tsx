interface ChartLoadingProps {
  transparent?: boolean;
}

/**
 * Loading spinner component for chart
 */
export const ChartLoading = ({ transparent = true }: ChartLoadingProps) => {
  return (
    <div
      className={`w-full min-h-screen ${
        transparent
          ? "bg-transparent"
          : "bg-gradient-to-br from-[#4786FF] to-[#2B5099]"
      } p-8 flex items-center justify-center`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );
};
