import { useDelayedRender } from "../../hooks/delayrenderhook";

const DelayedRenderUi = ({ delay, children }: any) => useDelayedRender(delay)(() => children);
export default DelayedRenderUi;