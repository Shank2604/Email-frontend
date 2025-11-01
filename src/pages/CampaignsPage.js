
// import React, { useEffect, useState, useContext } from "react";
// import API from "../api/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";
// import { AuthContext } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Dropdown,
//   Table,
//   Badge,
//   Spinner,
// } from "react-bootstrap";
// import { BellFill } from "react-bootstrap-icons";

// export default function CampaignsPage() {
//   const { token } = useContext(AuthContext);
//   const [title, setTitle] = useState("");
//   const [subject, setSubject] = useState("");
//   const [content, setContent] = useState("");
//   const [link, setLink] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [recipients, setRecipients] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [campaigns, setCampaigns] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);

//   useEffect(() => {
//     if (!token) return;
//     API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     fetchCampaigns();
//     fetchNotifications();
//     fetchTemplates();

//     const socket = io("http://localhost:5000");
//     socket.on("new-notification", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//       fetchCampaigns();
//     });

//     return () => socket.disconnect();
//   }, [token]);

//   // 🧠 Fetch Templates
//   const fetchTemplates = async () => {
//     try {
//       setLoadingTemplates(true);
//       const res = await API.get("/templates");
//       setTemplates(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load templates");
//     } finally {
//       setLoadingTemplates(false);
//     }
//   };

//   // 🧠 Fetch Campaigns
//   const fetchCampaigns = async () => {
//     try {
//       const res = await API.get("/campaigns");
//       setCampaigns(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🧠 Fetch Notifications
//   const fetchNotifications = async () => {
//     try {
//       const res = await API.get("/notifications");
//       const valid = res.data.filter((n) => !isExpired(n.createdAt));
//       setNotifications(valid);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const isExpired = (dateStr) => {
//     const createdAt = new Date(dateStr);
//     const now = new Date();
//     return now - createdAt > 24 * 60 * 60 * 1000;
//   };

//   // 🧩 Apply Template
//   const handleTemplateSelect = async (templateId) => {
//     setSelectedTemplate(templateId);
//     try {
//       const res = await API.get(`/templates/${templateId}`);
//       const template = res.data;

//       setTitle(template.title || "");
//       setContent(
//         template.blocks
//           .map((b) =>
//             b.type === "text"
//               ? `<p>${b.content}</p>`
//               : b.type === "image"
//               ? `<img src="${b.url}" style="max-width:100%;height:auto;border-radius:8px;" />`
//               : `<a href="${b.link}" style="display:inline-block;background:#007bff;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;">${b.text}</a>`
//           )
//           .join("<br/>")
//       );
//       // Get first image for preview (optional)
//       const firstImage = template.blocks.find((b) => b.type === "image");
//       if (firstImage) setImagePreview(firstImage.url);
//       const firstLink = template.blocks.find((b) => b.type === "button");
//       if (firstLink) setLink(firstLink.link || "");
//       toast.success("Template applied!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load template");
//     }
//   };

//   // 📤 Create Campaign
//   const createCampaign = async (e) => {
//     e.preventDefault();
//     if (!recipients && !csvFile) {
//       toast.error("Please provide recipients or upload a CSV file.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("subject", subject);
//       formData.append("content", content);
//       formData.append("link", link);
//       if (recipients) formData.append("recipients", recipients);
//       if (image) formData.append("image", image);
//       if (csvFile) formData.append("csvFile", csvFile);

//       await API.post("/campaigns", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Campaign sent successfully!");
//       setTitle("");
//       setSubject("");
//       setContent("");
//       setLink("");
//       setRecipients("");
//       setImage(null);
//       setCsvFile(null);
//       setSelectedTemplate("");
//       setImagePreview(null);
//       fetchCampaigns();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Error creating campaign");
//     }
//   };

//   return (
//     <Container className="py-5">
//       {/* 🔔 Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="text-primary">📧 Campaign Dashboard</h1>

//         <Dropdown
//           show={showDropdown}
//           onToggle={(isOpen) => setShowDropdown(isOpen)}
//         >
//           <Dropdown.Toggle variant="light" id="dropdown-basic">
//             <BellFill size={22} />
//             {notifications.length > 0 && (
//               <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
//                 {notifications.length}
//               </span>
//             )}
//           </Dropdown.Toggle>

//           <Dropdown.Menu
//             align="end"
//             style={{ minWidth: "300px", maxHeight: "300px", overflowY: "auto" }}
//           >
//             {notifications.length === 0 ? (
//               <Dropdown.ItemText className="text-muted text-center">
//                 No new notifications
//               </Dropdown.ItemText>
//             ) : (
//               notifications.map((note, i) => (
//                 <Dropdown.ItemText
//                   key={i}
//                   className={`text-${
//                     note.type === "success" ? "success" : "danger"
//                   }`}
//                 >
//                   {note.message}
//                   <br />
//                   <small className="text-muted">
//                     {new Date(note.createdAt).toLocaleString()}
//                   </small>
//                 </Dropdown.ItemText>
//               ))
//             )}
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>

//       {/* ✉️ Campaign Form */}
//       <Card className="mb-5 shadow-sm">
//         <Card.Body>
//           <Card.Title>Create New Campaign</Card.Title>
//           <Form onSubmit={createCampaign} encType="multipart/form-data">
//             {/* Template Dropdown */}
//             <Form.Group className="mb-3">
//               <Form.Label>Select Template</Form.Label>
//               {loadingTemplates ? (
//                 <Spinner animation="border" size="sm" />
//               ) : (
//                 <Form.Select
//                   value={selectedTemplate}
//                   onChange={(e) => handleTemplateSelect(e.target.value)}
//                 >
//                   <option value="">-- Select a Template --</option>
//                   {templates.map((tpl) => (
//                     <option key={tpl._id} value={tpl._id}>
//                       {tpl.title}
//                     </option>
//                   ))}
//                 </Form.Select>
//               )}
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Campaign Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email Subject</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Email HTML Content</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={6}
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Link (optional)</Form.Label>
//               <Form.Control
//                 type="url"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Upload Image (optional)</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   setImage(file);
//                   if (file) setImagePreview(URL.createObjectURL(file));
//                 }}
//               />
//             </Form.Group>

//             {imagePreview && (
//               <div className="mb-3 text-center">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   style={{ maxWidth: "300px", height: "auto", borderRadius: "8px" }}
//                 />
//               </div>
//             )}

//             <Form.Group className="mb-3">
//               <Form.Label>Upload Recipients CSV</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept=".csv"
//                 onChange={(e) => setCsvFile(e.target.files[0])}
//               />
//             </Form.Group>

//             <div className="text-center my-3 text-muted">OR</div>

//             <Form.Group className="mb-3">
//               <Form.Label>Recipients (comma separated)</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={recipients}
//                 onChange={(e) => setRecipients(e.target.value)}
//                 required={!csvFile}
//                 placeholder="Enter emails separated by commas"
//               />
//             </Form.Group>

//             <Button variant="success" type="submit">
//               Send Campaign
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>

//       {/* 📋 Campaigns Table */}
//       <h3>Your Campaigns</h3>
//       <Row xs={1} md={2} className="g-4 mb-5">
//         {campaigns.map((camp) => {
//           const opened = (camp.status || []).filter((s) => s.opened).length;
//           const unopened = (camp.status || []).filter((s) => !s.opened).length;

//           return (
//             <Col key={camp._id}>
//               <Card className="shadow-sm h-100">
//                 {camp.imageUrl && (
//                   <Card.Img
//                     variant="top"
//                     src={camp.imageUrl}
//                     alt="Campaign Banner"
//                     style={{
//                       height: "180px",
//                       objectFit: "cover",
//                       borderTopLeftRadius: "8px",
//                       borderTopRightRadius: "8px",
//                     }}
//                   />
//                 )}
//                 <Card.Body>
//                   <Card.Title>{camp.title}</Card.Title>
//                   <Card.Subtitle className="text-muted mb-2">
//                     {camp.subject}
//                   </Card.Subtitle>
//                   <Card.Text
//                     dangerouslySetInnerHTML={{
//                       __html: (camp.content || "").slice(0, 200),
//                     }}
//                   ></Card.Text>
//                   {camp.link && (
//                     <a href={camp.link} target="_blank" rel="noreferrer">
//                       🔗 Visit Link
//                     </a>
//                   )}
//                   <Table bordered size="sm" responsive className="mt-3">
//                     <tbody>
//                       <tr>
//                         <td>Total Recipients</td>
//                         <td>{(camp.recipients || []).length}</td>
//                       </tr>
//                       <tr>
//                         <td>Opened</td>
//                         <td>
//                           <Badge bg="success">{opened}</Badge>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td>Unopened</td>
//                         <td>
//                           <Badge bg="danger">{unopened}</Badge>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>
//     </Container>
//   );
// }
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function DynamicCampaignBuilder() {
  const { token } = useContext(AuthContext);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editableBlocks, setEditableBlocks] = useState([]);
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  // ✅ Fetch templates
  useEffect(() => {
    if (!token) return;
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchTemplates();
  }, [token]);

  const fetchTemplates = async () => {
    try {
      const res = await API.get("/templates");
      setTemplates(res.data);
    } catch (err) {
      toast.error("Failed to fetch templates");
    }
  };

  // ✅ When template is selected
  const handleTemplateSelect = (id) => {
    const tpl = templates.find((t) => t._id === id);
    if (tpl) {
      setSelectedTemplate(tpl);
      setEditableBlocks(tpl.blocks.map((b) => ({ ...b }))); // clone editable blocks
    }
  };

  // ✅ Handle block editing
  const handleBlockChange = (index, field, value) => {
    setEditableBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, [field]: value } : block))
    );
  };

  // ✅ Handle image upload change
  const handleImageUpload = async (index, file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await API.post("/templates/upload", formData);
      const imageUrl = res.data.imageUrl;
      handleBlockChange(index, "url", imageUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // ✅ Submit campaign
  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return toast.error("Select a template first");
    if (!recipients && !csvFile) return toast.error("Add recipients or CSV");

    const formData = new FormData();
    formData.append("title", selectedTemplate.title);
    formData.append("subject", subject);
    formData.append("recipients", recipients);
    formData.append("blocks", JSON.stringify(editableBlocks));
    if (csvFile) formData.append("csvFile", csvFile);

    try {
      await API.post("/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Campaign sent successfully!");
      setSelectedTemplate(null);
      setEditableBlocks([]);
      setSubject("");
      setRecipients("");
      setCsvFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send campaign");
    }
  };

  // ✅ Render editable template UI
  const renderEditableBlocks = () =>
    editableBlocks.map((block, index) => {
      switch (block.type) {
        case "text":
          return (
            <Form.Group className="mb-3" key={index}>
              <Form.Label>Text Block</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={block.content}
                onChange={(e) =>
                  handleBlockChange(index, "content", e.target.value)
                }
              />
            </Form.Group>
          );
        case "image":
          return (
            <div key={index} className="mb-3 text-center">
              {block.url && (
                <img
                  src={block.url}
                  alt="template"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(index, e.target.files[0])
                }
              />
            </div>
          );
        case "button":
          return (
            <Row key={index} className="mb-3">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Button Text"
                  value={block.text}
                  onChange={(e) =>
                    handleBlockChange(index, "text", e.target.value)
                  }
                />
              </Col>
              <Col md={7}>
                <Form.Control
                  type="url"
                  placeholder="Button Link"
                  value={block.link}
                  onChange={(e) =>
                    handleBlockChange(index, "link", e.target.value)
                  }
                />
              </Col>
              <div className="text-center mt-2">
                <Button
                  variant="primary"
                  href={block.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {block.text || "Button"}
                </Button>
              </div>
            </Row>
          );
        default:
          return null;
      }
    });

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4>Create Campaign from Template</h4>
          <Form.Group className="mb-3">
            <Form.Label>Select Template</Form.Label>
            <Form.Select
              value={selectedTemplate?._id || ""}
              onChange={(e) => handleTemplateSelect(e.target.value)}
            >
              <option value="">-- Select Template --</option>
              {templates.map((tpl) => (
                <option key={tpl._id} value={tpl._id}>
                  {tpl.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedTemplate && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Email Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Form.Group>

              {renderEditableBlocks()}

              <Form.Group className="mb-3">
                <Form.Label>Upload Recipients CSV</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Recipients (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                />
              </Form.Group>

              <Button variant="success" onClick={handleSendCampaign}>
                Send Campaign
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
