class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.13.3/auto-macos.gz"
  version "v10.13.3"
  sha256 "6101ea5c57aa6022ed7658b5cb9a491080327b71e6dfa49b037b4de4ba928716"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end