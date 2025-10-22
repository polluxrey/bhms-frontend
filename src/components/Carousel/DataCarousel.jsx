import Spinner from "react-bootstrap/Spinner";
import ResponsiveCarousel from "./ResponsiveCarousel";
import { useFetch } from "../../hooks/useFetch";

export default function DataCarousel({
  fetchDataFn,
  itemRenderer,
  errorKey = "Data",
}) {
  const {
    data: items,
    loading: isLoading,
    error: fetchError,
  } = useFetch(fetchDataFn);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (fetchError) {
    return (
      <p className="text-danger text-center py-3">Error loading {errorKey}.</p>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-muted text-center py-3">No {errorKey} available.</p>
    );
  }

  return (
    <ResponsiveCarousel
      items={items}
      // Use the passed-in itemRenderer function
      itemRenderer={itemRenderer}
    />
  );
}
