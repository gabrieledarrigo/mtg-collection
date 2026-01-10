import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Icon, IconName } from "./Icon";

describe("Icon", () => {
  it.each(Object.values(IconName))(
    "renders the %s icon correctly",
    (iconName) => {
      render(<Icon name={iconName} />);

      const svgElement = screen.getByTestId(`icon-${iconName}`);

      expect(svgElement).toMatchSnapshot();
    },
  );
});
