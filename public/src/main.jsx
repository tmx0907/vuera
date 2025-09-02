cd public
mkdir -p src
cat > src/main.jsx << 'EOF'
import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return <div style={{fontFamily:'system-ui',padding:'24px'}}>Vuera is live ✅</div>
}

createRoot(document.getElementById('root')).render(<App />)
EOF
