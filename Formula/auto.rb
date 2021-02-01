class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.13.4/auto-macos.gz"
  version "v10.13.4"
  sha256 "ca036ed2fc7346905753acaee9261aa473aaf0e89613c1b1fd0facbbc7038d3d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end