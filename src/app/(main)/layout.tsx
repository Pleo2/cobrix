// import Footer from "@modules/layout/templates/footer";
// import Nav from "@modules/layout/templates/nav";

export default async function LandingPageLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Nav /> */}
      {props.children}
      {/* <Footer /> */}
    </>
  );
}
