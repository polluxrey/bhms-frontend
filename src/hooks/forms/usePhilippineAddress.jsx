import { useEffect, useState } from "react";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";

export const usePhilippineAddress = (
  formData,
  setFormData,
  initialAddressData
) => {
  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  // Load regions on mount
  useEffect(() => {
    regions().then(setRegion);
  }, []);

  // Prepopulate dependent dropdowns whenever initialAddressData or formData changes
  useEffect(() => {
    // Determine current values: formData overrides initialAddressData
    const currentRegion = formData.region ?? initialAddressData?.region;
    const currentProvince = formData.province ?? initialAddressData?.province;
    const currentCity = formData.city ?? initialAddressData?.city;

    // Load provinces if region exists
    if (currentRegion) {
      provinces(currentRegion).then(setProvince);
    } else {
      setProvince([]);
    }

    // Load cities if province exists
    if (currentProvince) {
      cities(currentProvince).then(setCity);
    } else {
      setCity([]);
    }

    // Load barangays if city exists
    if (currentCity) {
      barangays(currentCity).then(setBarangay);
    } else {
      setBarangay([]);
    }
  }, [formData, initialAddressData]);

  const handleRegionChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      region: value,
      province: "",
      city: "",
      barangay: "",
    }));

    provinces(value).then(setProvince);
    setCity([]);
    setBarangay([]);
  };

  const handleProvinceChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      province: value,
      city: "",
      barangay: "",
    }));

    cities(value).then(setCity);
    setBarangay([]);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      city: value,
      barangay: "",
    }));

    barangays(value).then(setBarangay);
  };

  const handleBarangayChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      barangay: value,
    }));
  };

  return {
    regionData,
    provinceData,
    cityData,
    barangayData,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  };
};
