import { CSSProperties, onBeforeUnmount, onMounted, Ref } from 'vue';

//拖拽
export default function useDrag<T>(container: string, dragData: Ref<T[]>) {
  //拖拽容器
  let dragContainer: HTMLElement;
  //拖拽节点
  let sourceNode: HTMLElement;
  //拖拽节点的原始样式
  let nodeStyle: any = {};
  //拖拽节点的拖拽样式
  let dragStyle: any = {
    opacity: 0.35,
  };
  //设置拖拽样式
  const setDragStyle = (style: CSSProperties) => {
    dragStyle = style;
  };
  //拖拽开始时
  const dragStartHandler = (e: DragEvent) => {
    setTimeout(() => {
      const target = e.target as HTMLElement;
      //获取元素原始样式
      const style = getComputedStyle(target);
      Object.keys(dragStyle).forEach((key) => {
        nodeStyle[key] = style[key as any];
      });
      //设置元素拖拽样式
      Object.keys(dragStyle).forEach((key) => {
        target.style[key as any] = dragStyle[key];
      });
    }, 0);
    //设置拖拽节点
    sourceNode = e.target as HTMLElement;
    // e.dataTransfer!.effectAllowed = 'move';
  };
  //拖拽进入时
  const dragEnterHanlder = (e: DragEvent) => {
    if (e.target == dragContainer || e.target == sourceNode) {
      return;
    }
    const dragItems = [...dragContainer!.children];
    const sourceIndex = dragItems.findIndex((item) => item == sourceNode);
    const targetIndex = dragItems.findIndex((item) => item == e.target);
    const sourceValue = dragData.value[sourceIndex];
    dragData.value.splice(sourceIndex, 1);
    const left = dragData.value.slice(0, targetIndex);
    const right = dragData.value.slice(targetIndex);
    dragData.value = [...left, sourceValue, ...right];
    return false;
  };
  //拖拽在目标时
  const dragOverHandler = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = 'move';
    return false;
  };
  //拖拽结束时
  const dragEndHandler = () => {
    Object.keys(nodeStyle).forEach((key) => {
      sourceNode.style[key as any] = nodeStyle[key];
    });
  };
  //挂载拖拽事件
  onMounted(() => {
    dragContainer = document.querySelector(container) as HTMLElement;
    //注册事件
    dragContainer.addEventListener('dragstart', dragStartHandler);
    dragContainer.addEventListener('dragenter', dragEnterHanlder);
    dragContainer.addEventListener('dragover', dragOverHandler);
    dragContainer.addEventListener('dragend', dragEndHandler);
  });

  //卸载拖拽事件
  onBeforeUnmount(() => {
    dragContainer.removeEventListener('dragstart', dragStartHandler);
    dragContainer.removeEventListener('dragenter', dragEnterHanlder);
    dragContainer.removeEventListener('dragover', dragOverHandler);
    dragContainer.removeEventListener('dragend', dragEndHandler);
  });

  return {
    setDragStyle,
  };
}
