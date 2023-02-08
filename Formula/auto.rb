class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.39.0/auto-macos.gz"
  version "v10.39.0"
  sha256 "2411f9c00b98354dd1eb34115a3e8d5ac8f1bb32589b9ed91b3f4b145db4582c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end