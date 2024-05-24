export const Disclaimer = () => {
  return (
    <div>
      <div>
        <p
          style={{
            fontSize: "0.5em",
            textAlign: "center",
            width: "100%",
          }}
        >
          Created by{" "}
          <a href="https://twitter.com/dave_xt" target="_blank">
            Dave_xt
          </a>
        </p>
      </div>
      <div
        id="disclaimer"
        style={{
          fontSize: "0.5em",
          textAlign: "center",
          width: "100%",
        }}
      >
        <p>
          <strong>Disclaimer:</strong> The "Wordle Stats Editor" extension is an
          independent project and is not affiliated, endorsed, sponsored, or
          specifically approved by Wordle or The New York Times Company. All
          product names, logos, brands, trademarks and registered trademarks are
          property of their respective owners. Use of these names, logos, and
          brands does not imply endorsement. All specifications and data within
          this extension are for informational and editing purposes only. By
          using this extension, you understand and agree to use it at your own
          discretion and risk.
        </p>
      </div>
    </div>
  );
};
