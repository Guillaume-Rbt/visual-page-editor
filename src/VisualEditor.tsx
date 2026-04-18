import { Layout } from "./components/Layout";
import { usePartialStore } from "./Store";

export function VisualEditor() {


  const {blocs} = usePartialStore("blocs")

  console.log(blocs)

  return (
<div className="h-full w-full">
  <Layout ></Layout>
</div>
  );
}
