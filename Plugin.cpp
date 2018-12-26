/**
 * Orthanc - A Lightweight, RESTful DICOM Store
 * Copyright (C) 2012-2016 Sebastien Jodogne, Medical Physics
 * Department, University Hospital of Liege, Belgium
 * Copyright (C) 2017-2018 Osimis S.A., Belgium
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 **/


#include "../Common/OrthancPluginCppWrapper.h"


#include <boost/filesystem.hpp>
#include <json/value.h>
#include <json/reader.h>

#include <string.h>
#include <iostream>
#include <algorithm>
#include <EmbeddedResources.h>

static OrthancPluginContext* context_ = NULL;
static std::string folder_;

#define GRANT_ACCESS_PLUGIN_VERSION "0.1"


extern "C"
{
  static OrthancPluginErrorCode ServePriviledgeAdministration(OrthancPluginRestOutput* output,
                                                    const char* url,
                                                    const OrthancPluginHttpRequest* request)
  {
    if (request->method != OrthancPluginHttpMethod_Get)
    {
      OrthancPluginSendMethodNotAllowed(context_, output, "GET");
      return OrthancPluginErrorCode_Success;
    }

    try
    {
      std::string s;
      Orthanc::EmbeddedResources::GetFileResource(s, Orthanc::EmbeddedResources::PRIVILEDGE_ADMINISTRATION);

      const char* resource = s.size() ? s.c_str() : NULL;
      OrthancPluginAnswerBuffer(context_, output, resource, s.size(), "html");
    }
    catch (std::runtime_error&)
    {
      std::string s = "Unknown static resource in plugin: " + std::string(request->groups[0]);
      OrthancPluginLogError(context_, s.c_str());
      OrthancPluginSendHttpStatusCode(context_, output, 404);
    }

    return OrthancPluginErrorCode_Success;
  }

  ORTHANC_PLUGINS_API int32_t OrthancPluginInitialize(OrthancPluginContext* c)
  {
    context_ = c;

    std::string explorer;
    Orthanc::EmbeddedResources::GetFileResource(explorer, Orthanc::EmbeddedResources::ORTHANC_EXPLORER);
    OrthancPluginExtendOrthancExplorer(context_, explorer.c_str());

    OrthancPluginLogInfo(context_, "Serving static resources (standalone build)");
    OrthancPluginRegisterRestCallback(context_, "/priviledgeAdministration", ServePriviledgeAdministration);
    return 0;
  }


  ORTHANC_PLUGINS_API void OrthancPluginFinalize()
  {
    OrthancPluginLogWarning(context_, "OrthancAccessRights plugin is finalizing");
  }


  ORTHANC_PLUGINS_API const char* OrthancPluginGetName()
  {
    return "OrthancAccessRights";
  }


  ORTHANC_PLUGINS_API const char* OrthancPluginGetVersion()
  {
    return "0.1";
  }
}
