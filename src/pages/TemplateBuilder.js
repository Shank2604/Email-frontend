import React, { useState } from "react";
import API from "../api/axios";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

export default function TemplateBuilder() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addBlock = (type) => {
    const newBlock =
      type === "text"
        ? { type: "text", content: "" }
        : type === "image"
        ? { type: "image", url: "" }
        : { type: "button", text: "Click Here", link: "" };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, key, value) => {
    const updated = [...blocks];
    updated[index][key] = value;
    setBlocks(updated);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await API.post("/templates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateBlock(index, "url", data.imageUrl);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveTemplate = async () => {
    if (!title.trim()) return toast.error("Title required");
    if (blocks.length === 0) return toast.error("Add at least one block");

    try {
      await API.post("/templates", { title, blocks });
      toast.success("Template saved!");
      setTitle("");
      setBlocks([]);
    } catch {
      toast.error("Error saving template");
    }
  };

  return (
    <Container className="py-5">
      <Toaster position="top-right" />
      <h2 className="mb-4 text-center text-primary">
        🧱 Create Email Template
      </h2>

      {/* Template Title */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Template Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            borderRadius: "12px",
            padding: "12px",
            fontSize: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        />
      </Form.Group>

      {/* Add Blocks Buttons */}
      <div className="mb-4 d-flex gap-3 justify-content-center flex-wrap">
        <Button
          variant="outline-primary"
          className="fw-bold"
          onClick={() => addBlock("text")}
        >
          + Text
        </Button>
        <Button
          variant="outline-success"
          className="fw-bold"
          onClick={() => addBlock("image")}
        >
          + Image
        </Button>
        <Button
          variant="outline-warning"
          className="fw-bold"
          onClick={() => addBlock("button")}
        >
          + Button
        </Button>
      </div>

      <Row className="g-4">
        {/* Left Column: Block Editor */}
        <Col md={6}>
          {blocks.map((block, i) => (
            <Card
              key={i}
              className="p-3 mb-3 shadow-sm"
              style={{
                borderRadius: "14px",
                borderLeft: "5px solid",
                borderLeftColor:
                  block.type === "text"
                    ? "#007bff"
                    : block.type === "image"
                    ? "#28a745"
                    : "#ffc107",
                transition: "transform 0.2s",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-capitalize text-secondary">
                  {block.type}
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() =>
                    setBlocks(blocks.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </Button>
              </div>

              {block.type === "text" && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={block.content}
                  onChange={(e) => updateBlock(i, "content", e.target.value)}
                  placeholder="Enter text content"
                  style={{
                    borderRadius: "10px",
                    padding: "10px",
                    fontSize: "0.95rem",
                  }}
                />
              )}

              {block.type === "image" && (
                <>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, i)}
                    className="mb-2"
                  />
                  {uploading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    block.url && (
                      <img
                        src={block.url}
                        alt="preview"
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                          marginTop: "6px",
                          objectFit: "cover",
                        }}
                      />
                    )
                  )}
                </>
              )}

              {block.type === "button" && (
                <>
                  <Form.Control
                    type="text"
                    value={block.text}
                    onChange={(e) => updateBlock(i, "text", e.target.value)}
                    placeholder="Button Text"
                    className="mb-2"
                    style={{ borderRadius: "10px", padding: "10px" }}
                  />
                  <Form.Control
                    type="text"
                    value={block.link}
                    onChange={(e) => updateBlock(i, "link", e.target.value)}
                    placeholder="Button Link"
                    style={{ borderRadius: "10px", padding: "10px" }}
                  />
                </>
              )}
            </Card>
          ))}
        </Col>

        <div className="text-center mt-5">
          <Button
            variant="primary"
            size="lg"
            onClick={saveTemplate}
            style={{
              borderRadius: "14px",
              padding: "12px 40px",
              fontWeight: "600",
              background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)",
              border: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Save
          </Button>
        </div>

        {/* Right Column: Live Preview */}
        <Col md={6}>
          <Card className="p-3 shadow-lg" style={{ borderRadius: "14px" }}>
            <h6 className="text-muted mb-3 text-center">Live Preview</h6>
            <div className="d-flex flex-column gap-3">
              {blocks.map((b, i) => {
                if (b.type === "text")
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: "1rem",
                        color: "#444",
                        background: "#f8f9fa",
                        padding: "8px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {b.content}
                    </p>
                  );
                if (b.type === "image")
                  return (
                    <img
                      key={i}
                      src={b.url}
                      alt=""
                      style={{
                        maxWidth: "100%",
                        borderRadius: "12px",
                        objectFit: "cover",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  );
                if (b.type === "button")
                  return (
                    <a
                      key={i}
                      href={b.link}
                      style={{
                        display: "inline-block",
                        background:
                          "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        textAlign: "center",
                        fontWeight: "600",
                        transition: "0.2s transform",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      {b.text}
                    </a>
                  );
                return null;
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Save Button */}
    </Container>
  );
}
