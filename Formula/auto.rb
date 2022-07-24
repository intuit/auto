class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.3/auto-macos.gz"
  version "v10.37.3"
  sha256 "becc73fe48e3635476f9707383af717f93ad8d0bc7b41edf9f52758e46bb7aea"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end