import { useEffect, useState } from "react";

export function useBoarderPhoto(boarderId) {
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!boarderId) return;

    const fetchCurrentPhoto = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/boarder/${boarderId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch boarder data");

        const data = await response.json();
        setPreviewUrl(data.profile_photo_url || "");
        setOriginalPhotoUrl(data.profile_photo_url || "");
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load profile photo");
      }
    };

    fetchCurrentPhoto();
  }, [boarderId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // simpler than FileReader
  };

  const handlePhotoSave = async () => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append("profile_photo", photoFile);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/boarder/${boarderId}/upload_profile_photo/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload photo");

      const data = await response.json();
      setPreviewUrl(data.profile_photo_url);
      setOriginalPhotoUrl(data.profile_photo_url);
      setPhotoFile(null);
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handlePhotoCancel = () => {
    setPhotoFile(null);
    setPreviewUrl(originalPhotoUrl);
  };

  return {
    photoFile,
    previewUrl,
    selectedFileName: photoFile?.name || "",
    successMessage,
    errorMessage,
    handlePhotoChange,
    handlePhotoSave,
    handlePhotoCancel,
  };
}
