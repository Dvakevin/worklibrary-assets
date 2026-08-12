import http.server
import socketserver
import os

PORT = 8080
os.chdir("dist")

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Open http://localhost:{PORT}")
    httpd.serve_forever()
