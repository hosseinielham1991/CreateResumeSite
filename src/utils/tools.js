const setTimezone = ({ date }) => {
  if (date === undefined) {
    return;
  }

  const databaseTime = new Date(date);

  // Get client's local timezone offset in minutes
  const clientTimezoneOffset = new Date().getTimezoneOffset();

  // Calculate the timezone difference in milliseconds
  const timezoneDifference = clientTimezoneOffset * 60000; // Convert minutes to milliseconds

  // Convert the database time to the client's timezone
  const adjustedTime = new Date(databaseTime.getTime() - timezoneDifference);

  return adjustedTime.toISOString();
};

const downloadFile = async (path) => {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Set the download attribute with the desired file name
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "downloadedFile";
      if (contentDisposition) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          fileName = matches[1];
        }
      }
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error("Failed to download file:", response.statusText);
    }
  } catch (error) {
    console.error("Error while downloading the file:", error);
  }
};

export { setTimezone, downloadFile };
