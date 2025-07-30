#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If it's an API request, don't handle it here
        if path.startswith('/api'):
            self.send_error(404)
            return
            
        # Check if the requested file exists
        file_path = self.translate_path(path)
        
        # If the file doesn't exist and it's not a static asset, serve index.html
        if not os.path.exists(file_path) and not path.startswith('/assets') and '.' not in os.path.basename(path):
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == "__main__":
    PORT = 12001
    os.chdir('/workspace/housekeeping-app/frontend/dist/frontend/browser')
    
    with socketserver.TCPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()