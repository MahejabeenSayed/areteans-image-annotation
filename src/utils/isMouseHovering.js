import React, { PureComponent as Component } from "react";

const isMouseOverElement = ({ elem, e }) => {
  const { pageY, pageX } = e;
  const { left, right, bottom, top } = elem.getBoundingClientRect();

  return pageX > left && pageX < right && pageY > top && pageY < bottom;
};

const isMouseHovering =
  (key = "isMouseHovering") =>
  (DecoratedComponent) => {
    class IsMouseHovering extends Component {
      constructor() {
        super();

        this.state = {
          isHoveringOver: false,
        };
      }

      componentDidMount() {
        document.addEventListener("mousemove", this.onMouseMove);
      }

      componentWillUnmount() {
        document.removeEventListener("mousemove", this.onMouseMove);
      }

      onMouseMove = (e) => {
        const elem = document.getElementById("annotation-ele");
        // const elem = this.el;

        this.setState({
          isHoveringOver: isMouseOverElement({ elem, e }),
        });
      };

      render() {
        const hocProps = {
          [key]: {
            innerRef: (el) => {
              // const elem = document.getElementById('annotation-ele');
              this.el = el; // eslint-disable-line
            },
            isHoveringOver: this.state.isHoveringOver,
          },
        };

        // @ts-ignore
        return <DecoratedComponent {...this.props} {...hocProps} />;
      }
    }

    IsMouseHovering.displayName = `IsMouseHovering(${DecoratedComponent.displayName})`; // eslint-disable-line

    return IsMouseHovering;
  };

export default isMouseHovering;
