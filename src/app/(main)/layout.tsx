// import Footer from "@modules/layout/templates/footer";
// import Nav from "@modules/layout/templates/nav";

export default async function LandingPageLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="light bg-background text-foreground">
      {props.children}
    </div>
  );
}
