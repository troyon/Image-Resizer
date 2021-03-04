import {
  Button,
  createMuiTheme,
  Drawer,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { useEffect, useState, useRef } from "react";
import "./styles/App.css";

function App() {
  const [src, setSrc] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [imgSize, setImgSize] = useState(null);
  const [newWidth, setNewWidth] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const imageRef = useRef();

  function handleChange(e) {
    let file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      let fileUrl = URL.createObjectURL(file);
      const newImg = document.createElement("img");
      newImg.src = fileUrl;
      newImg.onload = () => {
        setCurrentHeight(newImg.height);
        setCurrentWidth(newImg.width);
        setImgSize(`${newImg.width}px x ${newImg.height}px`);
      };
      setSrc(fileUrl);
    }
  }

  function handleClick() {
    if (newWidth && newHeight) {
      const newImg = document.createElement("img");
      newImg.src = src;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = newHeight;
      canvas.width = newWidth;
      ctx.drawImage(newImg, 0, 0, parseInt(newWidth), parseInt(newHeight));
      const encoded = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = encoded;
      a.download = `${newWidth}x${newHeight}-${fileName}`;
      a.click();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleClick();
    }
  }

  function handleNewWidthChange(e) {
    const properHeight =
      (imageRef.current.naturalHeight / imageRef.current.naturalWidth) *
      e.target.value;
    setNewHeight(Math.round(properHeight));
    setNewWidth(e.target.value);
  }

  function handleNewHeightChange(e) {
    const properWidth =
      (imageRef.current.naturalWidth / imageRef.current.naturalHeight) *
      e.target.value;
    setNewWidth(Math.round(properWidth));
    setNewHeight(e.target.value);
  }

  // useEffect(() => {
  //   if (!newHeight) {
  //     const newImg = document.createElement("img");
  //     newImg.src = src;
  //     const newHeight = (newImg.height / newImg.width) * newWidth;
  //     setNewHeight(newHeight);
  //     console.log("newHeight", newHeight);
  //   }
  // }, [newWidth]);

  // useEffect(() => {
  //   if (!newWidth) {
  //     const newImg = document.createElement("img");
  //     newImg.src = src;
  //     const newWidth = (newImg.width / newImg.height) * newHeight;
  //     setNewWidth(newWidth);
  //     console.log("newWidth", newWidth);
  //   }
  // }, [newHeight]);

  const Theme = createMuiTheme({
    palette: {
      primary: {
        main: "#2863ee",
      },
      secondary: {
        main: "#ff0000",
      },
      error: {
        main: "#ffffff",
      },
    },
  });

  return (
    <ThemeProvider theme={Theme}>
      <main>
        {!src && (
          <div id="file-container">
            <input
              type="file"
              onChange={handleChange}
              id="file"
              title="Choose file"
            />
          </div>
        )}

        {src && (
          <div id="main">
            {src && (
              <div id="img-container">
                <img
                  ref={imageRef}
                  src={src}
                  id="input-image"
                  draggable="false"
                  alt="Input Img"
                  width="250"
                />
              </div>
            )}
            {imgSize && (
              <Drawer variant="persistent" anchor="right" open={true}>
                <header className="drawer-header">
                  <Typography variant="h5">Resize Menu</Typography>
                </header>
                <section id="inputs">
                  <TextField
                    fullWidth
                    label="New Width"
                    variant="outlined"
                    type="number"
                    value={newWidth}
                    placeholder={currentWidth.toString()}
                    onChange={handleNewWidthChange}
                    onKeyDown={handleKeyDown}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="New Height"
                    variant="outlined"
                    value={newHeight}
                    placeholder={currentHeight.toString()}
                    onChange={handleNewHeightChange}
                    onKeyDown={handleKeyDown}
                  />

                  <Button
                    disableElevation
                    color="primary"
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={handleClick}
                  >
                    Convert
                  </Button>
                  <Button
                    disableElevation
                    color="primary"
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={() => setSrc(null)}
                  >
                    Cancel
                  </Button>
                </section>
              </Drawer>
            )}
          </div>
        )}
      </main>
    </ThemeProvider>
  );
}

export default App;
