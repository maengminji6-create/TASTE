"""취향수집소 로컬 서버

같은 Wi-Fi에 있는 휴대폰이 상세페이지의 QR을 찍어 기록 페이지(archive.html)를 열 수 있도록,
이 폴더를 내 PC의 네트워크 주소로 띄워 줘요.

    python serve.py          # 기본 포트 8000
    python serve.py 5500     # 포트 지정
"""
import functools
import http.server
import socket
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


def lan_ip() -> str:
    """휴대폰이 접속할 수 있는 이 PC의 내부 IP (실제로 패킷은 보내지 않아요)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def main() -> None:
    ip = lan_ip()
    url = f"http://{ip}:{PORT}/index.html#top"
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler) as httpd:
        print("=" * 56)
        print(" 취향수집소 서버가 켜졌어요")
        print(f" PC에서 보기   : {url}")
        print(f" 기록 페이지   : http://{ip}:{PORT}/archive.html?box=0712")
        print(" 휴대폰과 PC가 같은 Wi-Fi여야 QR이 열려요.")
        print(" Windows 방화벽 창이 뜨면 '허용'을 눌러 주세요.")
        print(" 끄려면 이 창에서 Ctrl + C")
        print("=" * 56)
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 껐어요.")


if __name__ == "__main__":
    main()
