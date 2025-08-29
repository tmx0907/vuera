export default function handler(req, res) {
  res.status(200).json({
    status: "healthy",
    service: "vuera-ai",
    timestamp: new Date().toISOString(),
  });
}

