export const useDragAndDrop = () => {
  const handleDragStart = (e, columnId, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return {
    handleDragStart,
    handleDragOver
  };
};