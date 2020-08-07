class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.0/auto-macos.gz"
  version "v9.50.0"
  sha256 "057003cf3252b697cdaf5ee9ddc16fd2dc23d9bb4e7272ec23e2ea50e70be060"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end