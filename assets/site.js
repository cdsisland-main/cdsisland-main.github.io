document.querySelectorAll("[data-last-updated]").forEach((element) => {
  const modified = new Date(document.lastModified);
  const date = Number.isNaN(modified.getTime()) ? new Date() : modified;

  element.dateTime = date.toISOString();
  element.textContent = date.toLocaleDateString();
});
